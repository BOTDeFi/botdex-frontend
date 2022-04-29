export const useFindPath = {};
// import React from 'react';
//
// import { useGetAllPairs } from '@/services/api/refinery-finance-pairs';
// import { ITokens } from '@/types';
//
// export const useFindPath = ({ tokensData }: { tokensData: ITokens }) => {
//   const getAllPairs = useGetAllPairs();
//
//   // const [path] = React.useState<string[]>([]);
//   const [pairs] = React.useState([
//     ['t1', 't2'],
//     ['t2', 't4'],
//     ['t4', 't6'],
//     ['t1', 't3'],
//     ['t3', 't5'],
//     ['t5', 't6'],
//     ['t1', 't6'],
//   ]);
//   // const [pairs] = React.useState<string[][]>([]);
//   const [adjacencies] = React.useState<{ [key: string]: string[] }>({});
//   const [groups] = React.useState(new Set());
//   const [visited] = React.useState<{ [key: string]: boolean }>({});
//
//   const convertEdgesToAdjacencies = React.useCallback(() => {
//     let pair;
//     let u: string;
//     let v: string;
//     if (Object.keys(adjacencies).length === 0) {
//       for (let i = 0; i < pairs.length; i += 1) {
//         pair = pairs[i];
//         [u, v] = pair;
//         if (adjacencies[u]) {
//           adjacencies[u].push(v);
//         } else {
//           adjacencies[u] = [v];
//         }
//         if (adjacencies[v]) {
//           adjacencies[v].push(u);
//         } else {
//           adjacencies[v] = [u];
//         }
//       }
//     }
//     console.log('adjacencies', adjacencies);
//   }, [adjacencies, pairs]);
//
//   const bfs = React.useCallback(
//     (src: string) => {
//       const q: string[] = [];
//       let v: string = src;
//       let adjV: string[];
//       let nextVertex: string;
//       const currentGroup: string[] = [];
//       q.push(v);
//       visited[v] = true;
//       while (q.length > 0) {
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         v = q.shift();
//         currentGroup.push(v);
//         adjV = adjacencies[v];
//         for (let i = 0; i < adjV.length; i += 1) {
//           nextVertex = adjV[i];
//           if (!visited[nextVertex]) {
//             q.push(nextVertex);
//             visited[nextVertex] = true;
//           }
//         }
//       }
//       // groups.push(currentGroup);
//     },
//     [adjacencies, visited],
//   );
//
//   const printAllPathsUtil = React.useCallback(
//     (start, destination, isVisited, localPathList) => {
//       if (start === destination) {
//         groups.add(localPathList);
//         // groups.add(JSON.parse(JSON.stringify(localPathList)));
//         return;
//       }
//
//       isVisited[start] = true;
//
//       for (let i = 0; i < adjacencies[start].length; i += 1) {
//         if (!isVisited[adjacencies[start][i]]) {
//           localPathList.push(adjacencies[start][i]);
//           printAllPathsUtil(adjacencies[start][i], destination, isVisited, localPathList);
//           localPathList.splice(localPathList.indexOf(adjacencies[start][i]), 1);
//         }
//       }
//       isVisited[start] = false;
//     },
//     [adjacencies, groups],
//   );
//
//   const printAllPaths = React.useCallback(
//     (start, destination) => {
//       const v = 7;
//       const isVisited = new Array(v);
//       for (let i = 0; i < v; i += 1) {
//         isVisited[i] = false;
//         const pathList = [];
//         pathList.push(start);
//         printAllPathsUtil(start, destination, isVisited, pathList);
//       }
//     },
//     [printAllPathsUtil],
//   );
//
//   React.useEffect(() => {
//     if (tokensData.to.token && tokensData.from.token) {
//       convertEdgesToAdjacencies();
//       printAllPaths('t1', 't6');
//       // Object.keys(adjacencies).forEach((key) => {
//       //   if (Object.hasOwnProperty.call(adjacencies, key) && !visited[key]) {
//       //     bfs(key);
//       //   }
//       // });
//       console.log('groups', groups);
//       // console.log(' tokensData', tokensData);
//       // groups.forEach((group) => {
//       //   if (
//       //     group[0] === tokensData.from.token?.address.toLowerCase() &&
//       //     group[groups.length - 1] === tokensData.from.token?.address.toLowerCase()
//       //   ) {
//       //     console.log('success', group);
//       //     // check amount
//       //   }
//       // });
//       // save path with max amount
//     }
//   }, [adjacencies, bfs, convertEdgesToAdjacencies, groups, printAllPaths, tokensData, visited]);
//
//   const fetchAllPairs = React.useCallback(async () => {
//     if (pairs.length === 0) {
//       const result = await getAllPairs();
//       console.log(result);
//       // result.pairs.forEach((pair: any) => {
//       //   pairs.push([pair.token0.id, pair.token1.id]);
//       //   pairs.push([pair.token1.id, pair.token0.id]);
//       // });
//     }
//   }, [getAllPairs, pairs]);
//
//   React.useEffect(() => {
//     fetchAllPairs().catch((err) => console.log(err));
//   }, [fetchAllPairs]);
//
//   // return path;
// };
