import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

import MUIDataTable from "mui-datatables";


const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        flexGrow: 1,
    },
}));

const columns = [
    {
        name: "name",
        label: "Name",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "id",
        label: "ID",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "description",
        label: "Description",
        options: {
            filter: true,
            sort: true,
        }
    },
];

const TableWrapper = () => {
    const classes = useStyles();
    const [displayData, setDisplayData] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [rpp, setRpp] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(1);

    const options = {
        page: pageNumber,
        rowsPerPage: rpp,
    };

    React.useEffect(() => {
        axios.get("http://127.0.0.1:8000/get_data")
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.error(err)
            })
    }, []);

    return (
        <div className={classes.root}>
            <MUIDataTable
                title={"Demo"}
                data={displayData}
                columns={columns}
                options={options}
            />
        </div>
    );
};

export default TableWrapper;