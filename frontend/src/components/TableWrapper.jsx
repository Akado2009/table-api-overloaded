import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

import MUIDataTable from "mui-datatables";

import CustomFooter from './CustomFooter';


const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        flexGrow: 1,
    },
}));

const columns = [
    {
        name: "Name",
        label: "Name",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "ID",
        label: "ID",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "Description",
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
    const [rpp, setRpp] = React.useState(20);
    const [pageNumber, setPageNumber] = React.useState(0);

    const changeRowsPerPage = (newRpp) => {
        // setDisplayData(data.slice(pageNumber * rpp, pageNumber * newRpp));
        setRpp(newRpp);
    };

    const changePage = (page) => {
        setDisplayData(data.slice(pageNumber * rpp, (pageNumber + 1) * rpp));
        setPageNumber(page);
    };

    const newCustomSort = (_, colIndex, order) => {
        // 
        if (data.length > 0) {
            let newData = data.splice();
            let keys = Object.keys(data[0]);
            if (order === "desc") {
                newData.sort((a, b) => (a[keys[colIndex]] > b[keys[colIndex]]) ? 1 : -1)
            } else {
                newData.sort((a, b) => (a[keys[colIndex]] < b[keys[colIndex]]) ? 1 : -1)
            }
            setData(newData);
            setDisplayData(newData.slice(0, rpp));
        }
        return displayData;
    };

    const newCustomSearch = (searchQuery, currentRow, columns) => {
        let newData = data.splice();
        newData.filter(x => x.Name.includes(searchQuery))
        setData(newData);
        setDisplayData(newData.slice(0, rpp));
        return true;
    };

    const options = {
        page: pageNumber,
        rowsPerPage: rpp,
        customFooter: (textLabels) => {
            return (  
              <CustomFooter 
                count={data.length} 
                page={pageNumber} 
                rowsPerPage={rpp} 
                changeRowsPerPage={changeRowsPerPage} 
                changePage={changePage} 
                textLabels={textLabels} />
            );
        },
        customSort: (data, colIndex, order) => newCustomSort(data, colIndex, order),
        customSearch: (searchQuery, currentRow, columns) => newCustomSearch(searchQuery, currentRow, columns)
    };

    React.useEffect(() => {
        axios.get("http://127.0.0.1:8000/get_data")
            .then(response => {
                setData(response.data);
                setDisplayData(response.data.slice(0, rpp));
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