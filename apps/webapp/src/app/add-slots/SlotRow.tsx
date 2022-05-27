import {FC} from "react";

export type SlotRowProps = {
  id: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
}

export const SlotRow: FC<SlotRowProps> = (props) => {
  return (
    <div>
      <input>{props.date}</input>
      <input>{props.timeFrom}</input>
      <input>{props.timeTo}</input>
      <button>usuń</button>
    </div>
  );
}
