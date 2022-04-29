import MetamaskService from '@/services/web3';
import { getContract } from '@/services/web3/contractHelpers';
import { ITokens } from '@/types';

export function findPath(tokensData: ITokens, pairs: string[][]): string[] {
  // const pairs = [
  //   ['t1', 't2'],
  //   ['t2', 't4'],
  //   ['t4', 't6'],
  //   ['t1', 't3'],
  //   ['t3', 't5'],
  //   ['t5', 't6'],
  //   ['t1', 't6'],
  // ];
  const maxPathLength = 5;
  const adjacencies: { [key: string]: string[] } = {};
  const groups: string[][] = [];
  let path: string[] = [];

  function convertEdgesToAdjacencies() {
    let pair;
    let u: string;
    let v: string;
    if (Object.keys(adjacencies).length === 0) {
      for (let i = 0; i < pairs.length; i += 1) {
        pair = pairs[i];
        [u, v] = pair;
        if (adjacencies[u]) {
          adjacencies[u].push(v);
        } else {
          adjacencies[u] = [v];
        }
        if (adjacencies[v]) {
          adjacencies[v].push(u);
        } else {
          adjacencies[v] = [u];
        }
      }
    }
  }

  function findAllPaths(start: string, destination: string) {
    const v = 6;
    const isVisited = new Array(v);
    for (let i = 0; i < v; i += 1) {
      isVisited[i] = false;
    }
    const pathList = [];
    pathList.push(start);
    findAllPathsUtil(start, destination, isVisited, pathList);
  }

  function findAllPathsUtil(
    start: string,
    destination: string,
    isVisited: any,
    localPathList: string[],
  ) {
    if (start === destination) {
      groups.push(JSON.parse(JSON.stringify(localPathList)));
      return;
    }

    isVisited[start] = true;

    for (let i = 0; i < adjacencies[start].length; i += 1) {
      if (localPathList.length > maxPathLength) {
        return;
      }
      if (!isVisited[adjacencies[start][i]]) {
        localPathList.push(adjacencies[start][i]);
        findAllPathsUtil(adjacencies[start][i], destination, isVisited, localPathList);
        localPathList.splice(localPathList.indexOf(adjacencies[start][i]), 1);
      }
    }
    isVisited[start] = false;
  }

  function findBestAmount() {
    let currentAmount = 0;
    let finalPath: string[] = groups[0];
    if (tokensData.from.amount && tokensData.from.token) {
      const amount = MetamaskService.calcTransactionAmount(
        tokensData.from.amount,
        +tokensData.from.token?.decimals,
      );
      groups.forEach(async (group) => {
        const contract = getContract('ROUTER');
        const result = await contract.methods.getAmountsOut(amount, group).call();
        if (result[1] > currentAmount) {
          [, currentAmount] = result;
          finalPath = group;
        }
      });
    }
    return finalPath;
  }

  if (tokensData.to.token && tokensData.from.token) {
    if (pairs.length > 1) {
      convertEdgesToAdjacencies();
      findAllPaths(
        tokensData.from.token.address.toLowerCase(),
        tokensData.to.token.address.toLowerCase(),
      );
      findBestAmount();
    } else {
      [path] = pairs;
    }
  }
  return path;
}
