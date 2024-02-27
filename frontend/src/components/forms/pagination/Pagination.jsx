import { memo } from "react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";

import "./Pagination.scss";

const Pagination = memo(({ currentPage, dataLength, size, onPageChange }) => {
  const limit = Math.ceil(dataLength / size);

  const renderPageNos = () => {
    const pageNos = [];

    for (let index = 1; index <= limit; index++) {
      let htmlEle = (
        <div
          className={`col-auto page-${index} ${
            currentPage === index ? "page-no-selected" : "page-no"
          }`}
          key={index}
          onClick={() => onPageChange(index)}
        >
          {index}
        </div>
      );

      pageNos.push(htmlEle);
    }

    return pageNos;
  };

  const handleClassNameAndCallingFn = (onAction, actionType) => {
    switch (onAction) {
      case "doubleLeft":
        const doubleLeftCondition = currentPage > 2;

        if (actionType === "className")
          return doubleLeftCondition ? "page-no" : "page-no-disabled";
        if (doubleLeftCondition) return onPageChange(1);
        return;
      case "left":
        const leftCondition = currentPage > 1;

        if (actionType === "className")
          return leftCondition ? "page-no" : "page-no-disabled";
        if (leftCondition) return onPageChange(currentPage - 1);
        return;
      case "doubleRight":
        const doubleRightCondition = currentPage < limit - 1;

        if (actionType === "className")
          return doubleRightCondition ? "page-no" : "page-no-disabled";
        if (doubleRightCondition) return onPageChange(limit);
        return;
      case "right":
        const rightCondition = currentPage < limit;

        if (actionType === "className")
          return rightCondition ? "page-no" : "page-no-disabled";
        if (rightCondition) return onPageChange(currentPage + 1);
        return;
      default:
        break;
    }
  };

  return (
    <main className="row justify-content-center gap-1">
      <div
        className={`col-auto first-page ${handleClassNameAndCallingFn(
          "doubleLeft",
          "className"
        )}`}
        onClick={() => handleClassNameAndCallingFn("doubleLeft")}
      >
        <HiOutlineChevronDoubleLeft />
      </div>
      <div
        className={`col-auto previous-page ${handleClassNameAndCallingFn(
          "left",
          "className"
        )}`}
        onClick={() => handleClassNameAndCallingFn("left")}
      >
        <HiOutlineChevronLeft />
      </div>
      {renderPageNos()}
      <section
        className={`col-auto next-page ${handleClassNameAndCallingFn(
          "right",
          "className"
        )}`}
        onClick={() => handleClassNameAndCallingFn("right")}
      >
        <HiOutlineChevronRight />
      </section>
      <section
        className={`col-auto last-page ${handleClassNameAndCallingFn(
          "doubleRight",
          "className"
        )}`}
        onClick={() => handleClassNameAndCallingFn("doubleRight")}
      >
        <HiOutlineChevronDoubleRight />
      </section>
    </main>
  );
});

export default Pagination;
