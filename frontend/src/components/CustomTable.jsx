import React from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


import axios from 'axios';


const headCells = [
  { id: 'Name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'ID', numeric: true, disablePadding: false, label: 'ID' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Desription' },
];

const EnhancedTableHead = (props) => {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
            {headCells.map(headCell => (
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === headCell.id ? order : false}
                >
                    <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={order}
                    onClick={createSortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            ))}
            </TableRow>
        </TableHead>
    );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    textField: {
        width: '100%',
    },
}));

export default function CustomTableWrapper() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([]);
    const [rowsBackup, setRowsBackup] = React.useState([]);
    const [rowsToDisplay, setRowsToDisplay] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleRequestSort = (event, property) => {
        const isDesc =  orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
        
        let newData = rows.slice();
        if (isDesc === "asc") {
            newData.sort((a, b) => (a[property] < b[property]) ? 1 : -1)
        } else {
            newData.sort((a, b) => (a[property] > b[property]) ? 1 : -1)
        }
        setRows(newData);
        setPage(0);
        setRowsToDisplay(newData.slice(0, rowsPerPage));
    };

    const handleChangePage = (event, newPage) => {
        // working on second time only????
        let oldPage = page;
        setPage(newPage);
        if (newPage > page) {
            setRowsToDisplay(rows.slice(oldPage * rowsPerPage, newPage * rowsPerPage));
        } else {
            setRowsToDisplay(rows.slice(newPage * rowsPerPage, oldPage * rowsPerPage));
        }
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setRowsToDisplay(rows.slice(0, parseInt(event.target.value, 10)));
    };

    const handleSearchTerm = (event) => {
        let newData = rowsBackup.slice()
        if (newData.length > 0) {
            if (event.target.value !== "") {
                let keys = Object.keys(newData[0]);
                newData = newData.filter(x => {
                    if (x.Name.includes(event.target.value)) {
                        return true;
                    }
                    return false;
                });
            }
        }
        setSearchTerm(event.target.value);
        setRows(newData);
        setPage(0);
        setRowsToDisplay(newData.slice(0, rowsPerPage));
    };

    React.useEffect(() => {
        axios.get("http://127.0.0.1:8000/get_data")
            .then(response => {
                setRows(response.data);
                setRowsBackup(response.data);
                setRowsToDisplay(response.data.slice(0, rowsPerPage));
            })
            .catch(err => {
                console.error(err)
            })
    }, []);
    
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TextField
                    value={searchTerm}
                    onChange={handleSearchTerm}
                    class={classes.textField}
                />
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                        {rowsToDisplay.map((row, index) => {
                            return (
                                <TableRow
                                    key={index}
                                >
                                    <TableCell component="th" scope="row" padding="none">
                                        {row.Name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.ID}
                                    </TableCell>
                                    <TableCell align="right"> 
                                        {row.Description}
                                    </TableCell>
                                </TableRow>
                                );
                        })}
                        </TableBody>
                    </Table>
                </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            </Paper>
        </div>
    );
}