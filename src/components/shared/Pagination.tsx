"use client";
import * as React from "react";
import { FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { paginationParams } from "@/hooks/use-pagination-params";

interface PaginationProps {
  pageCount: number;
  className?: string;
}

interface PaginationArrowProps extends React.ComponentProps<"button"> {
  direction: "left" | "right";
}

const PaginationArrow: FC<PaginationArrowProps> = ({ direction, ...props }) => {
  const isLeft = direction === "left";

  return (
    <Button
      className={cn(
        "border border-[#E4E4E7] bg-secondary hover:bg-primary text-white",
        "disabled:bg-secondary/20 disabled:text-secondary/20"
      )}
      size="icon"
      {...props}
    >
      {isLeft ? (
        <ChevronLeft className={cn(props.disabled && "text-white/50")} />
      ) : (
        <ChevronRight className={cn(props.disabled && "text-white/50")} />
      )}
    </Button>
  );
};

interface PagiantionButtonProps extends React.ComponentProps<"button"> {
  pageNumber: number;
  isActive: boolean;
}

const PaginationButton: FC<PagiantionButtonProps> = ({
  pageNumber,
  isActive,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "hover:bg-primary/5 bg-transparent mx-1 text-base",
        isActive
          ? "text-primary border border-primary font-semibold rounded-lg"
          : "text-white/50 font-medium"
      )}
      size="sm"
      {...props}
    >
      {pageNumber}
    </Button>
  );
};

export function PaginationProperties({
  pageCount,
  className,
}: Readonly<PaginationProps>) {
  const [isLoading, startTransition] = React.useTransition();
  const [page, setPage] = useQueryState(
    "page",
    paginationParams.page.withOptions({
      startTransition,
      shallow: false, // Send updates to the server
      // scroll: false, // Don't scroll to top
    })
  );

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(pageCount, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn(className)}>
      <PaginationContent className="gap-3">
        <PaginationItem>
          <PaginationArrow
            direction="left"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
          />
        </PaginationItem>

        {/* 
          show first page if current page is not the first page
        */}
        {page - 2 > 1 && (
          <>
            <PaginationButton
              pageNumber={1}
              isActive={page === 1}
              onClick={() => setPage(1)}
              disabled={page === 1 || isLoading}
            />
            <span>...</span>
          </>
        )}

        <PaginationItem>
          {pageNumbers.map(pageNumber => (
            <PaginationButton
              key={pageNumber}
              pageNumber={pageNumber}
              isActive={page === pageNumber}
              onClick={() => setPage(pageNumber)}
              disabled={pageNumber === page || isLoading}
            />
          ))}

          {/* Show last page if current page is not the last page */}
          {page < pageCount - 2 && (
            <>
              <span>...</span>
              <PaginationButton
                pageNumber={pageCount}
                isActive={page === pageCount}
                onClick={() => setPage(pageCount)}
                disabled={page === pageCount || isLoading}
              />
            </>
          )}
        </PaginationItem>
        <PaginationItem>
          <PaginationArrow
            direction="right"
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount || isLoading}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
