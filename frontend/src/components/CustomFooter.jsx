import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MuiTablePagination from "@material-ui/core/TablePagination";


const CustomFooter = (props) => {
    const handleRowChange = event => {
        props.changeRowsPerPage(event.target.value);
    };

    const handlePageChange = (_, page) => {
        props.changePage(page);
    };

    const { count, textLabels, rowsPerPage, page } = props;
    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={1000}>
                <MuiTablePagination
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage={textLabels.rowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
                    backIconButtonProps={{
                        'aria-label': textLabels.previous,
                    }}
                    nextIconButtonProps={{
                        'aria-label': textLabels.next,
                    }}
                    rowsPerPageOptions={[10,20,100]}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowChange}
                    />
                </TableCell>
            </TableRow>
        </TableFooter>
    )
};

export default CustomFooter;