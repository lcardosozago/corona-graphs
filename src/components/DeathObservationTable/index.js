import React, { useState, useEffect } from "react";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import observations from "../../assets/observations.json";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: "0.7rem",
    paddingTop: "2px",
    paddingBottom: "2px",
  },
  body: {
    fontSize: "0.6rem",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  tableWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px 0 10px 0",
  },
  tableContainer: {
    width: "95%",
    height: "100%",
  },
  table: {
    width: "100%",
    height: "100%",
  },
});

export default function DeathObservationTable() {
  const [data, setData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let newData = [];

    observations.map((observation) => {
      if (observation.status === "death") {
        newData.push(observation);
      }
    });

    setData(newData);
  }, []);

  return (
    <div className={classes.tableWrapper}>
      <h5>Observações:</h5>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="customized table"
        >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Cidade</StyledTableCell>
              <StyledTableCell>Detalhes</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((observation, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {observation.city}
                </StyledTableCell>
                <StyledTableCell>{observation.details}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
