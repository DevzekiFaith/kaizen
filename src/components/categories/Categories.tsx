import React from "react";

export default function Categories() {
  return (
    <div>
      <div>
        <div>
          <div>
            <div className="mb-[1rem]">
              <label className="text-slate-400 text-[12px]">Activity</label>
            </div>
            <select
              className="bg-slate-500 text-[12px] p-[8px] rounded-2xl xl:w-[24rem] w-[18rem] h-[2.5rem]"
              id="Activities"
              name="Progress Work"
              title="Progress Work"
            >
              <option value="Eating">Eating</option>
              <option value="Exercise">Exercise</option>
              <option value="Reading">Reading</option>
              <option value="free Time">Free Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
