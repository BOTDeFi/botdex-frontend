import { IBasePopover } from '@/HOC/BasePopover';

export interface IMultiplierPopoverProps extends Omit<IBasePopover, 'text'> {
  symbol: string;
}
