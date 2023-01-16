import React, { useState, useMemo, useCallback, useEffect } from "react";
import "react-data-grid/lib/styles.css";
import DataGrid, { SortColumn } from "react-data-grid";
import styled from "styled-components";

const DataGridContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

type Comparator = (a: any, b: any) => number;

type TableProps = {
  data: {
    columns: Object[];
    rows: Object[];
  };
};

const Table: React.FC<TableProps> = ({ data }) => {
  const [rows, setRows] = useState(data.rows);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  function getComparator(sortColumn: string): Comparator {
    if (sortColumn.search("string") >= 0)
      return (a: any, b: any) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    return (a: any, b: any) => {
      return a[sortColumn] - b[sortColumn];
    };
  }

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);

  return (
    <DataGridContainer className="hide-scroll-bar">
      <DataGrid
        defaultColumnOptions={{
          sortable: true,
        }}
        // @ts-ignore
        columns={data.columns}
        rows={sortedRows}
        onRowsChange={setRows}
        sortColumns={sortColumns}
        onSortColumnsChange={onSortColumnsChange}
        className="fill-grid"
      />
    </DataGridContainer>
  );
};

export default Table;
