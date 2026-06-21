import { jsxs, jsx } from "react/jsx-runtime";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
dayjs.extend(isSameOrAfter);
const AvailableSlots = ({
  date,
  availableSlots,
  onSelect,
  selectedSlot
}) => {
  const now = dayjs();
  const selectedDay = dayjs(date).startOf("day");
  const isToday = now.isSame(selectedDay, "day");
  const cutoffTime = now.add(2, "hour");
  const filteredSlots = availableSlots.filter((slot) => {
    if (!isToday) return true;
    const [startTime] = slot.split(" - ");
    const slotTime = dayjs(`${date} ${startTime}`, "YYYY-MM-DD h:mm a");
    return slotTime.isSameOrAfter(cutoffTime);
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-xl font-bold mb-2", children: [
      "Available Slots for ",
      date
    ] }),
    filteredSlots.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: filteredSlots.map((slot, index) => /* @__PURE__ */ jsx(
      "li",
      {
        onClick: () => onSelect(slot),
        className: `p-2 rounded cursor-pointer border ${selectedSlot === slot ? "bg-green-600 text-white" : "bg-green-200 hover:bg-green-300"}`,
        children: slot
      },
      index
    )) }) : /* @__PURE__ */ jsx("p", { className: "text-red-500", children: "No available slots for this day." })
  ] });
};
export {
  AvailableSlots as default
};
