import React, { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Cookies from 'js-cookie';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function DenseTable() {
  const token = Cookies.get('auth-token');
  const decodedToken = jwt.decode(token);
  const isAdmin = decodedToken.admin;


  const [data, setData] = useState({ hits: [], reloading: true });
  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get("api/readers");
      setData({ hits: result.data, reloading: false });
    }

    fetchData();
  }, [setData]);

  function handleSubmit(event) {
    async function postData() {
      const result = await axios
        .post("api/readers", {
          fullName: fullName,
          cardNumber: cardNumber,
        })
        .then(function (response) {
          setMessage(response.data);
          setOpen(true);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    async function fetchData() {
      const result = await axios.get("api/readers");
      setData({ hits: result.data });
      console.log(data);
    }

    async function updateState() {
      await postData();
      await fetchData();
    }
    updateState();
    event.preventDefault();
  }

  function onDelete(id) {
    async function deleteData() {
      const result = await axios
        .delete("api/readers/" + id)
        .then(function (response) {
          setMessage(response.data);
          setOpen(true);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    async function fetchData() {
      const result = await axios.get("api/readers");
      setData({ hits: result.data });
      console.log(data);
    }

    async function updateState() {
      await deleteData();
      await fetchData();
    }
    updateState();
  }

  const classes = useStyles();
  if (data.reloading) {
    return (
      <div className={classes.root}>
        <LinearProgress color="secondary" />
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <Container maxWidth="lg" mt={100}>
          <Box mt={5}>
          <Link exact to="/" style={{ textDecoration: "none" }}>
                <Button variant="outlined" color="primary">
                  Вернуться
                </Button>
              </Link>
            <Grid container spacing={3}>
              <Box mt={8} mb={5}>
                <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                ><div>
                  <TextField
                    id="fullName"
                    name="fullName"
                    label="ФИО"
                    type="text"
                    onChange={(e) => setFullName(e.target.value)}
                  /></div>
                  <div><br></br>
                  <TextField
                    id="cardNumber"
                    name="cardNumber"
                    label="Номер билета"
                    type="text"
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  </div>
                  <br></br>
                  <Button variant="contained" color="primary" type="submit">
                    Добавить читателя
                  </Button>
                </form>
              </Box>
              <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
              >
                <Alert severity="success" onClose={handleClose}>
                  {message}
                </Alert>
              </Snackbar>
              <TableContainer component={Paper}>
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>ФИО</TableCell>
                      <TableCell>Номер читательского билета</TableCell>
                      <TableCell>Редактировать</TableCell>
                      {isAdmin ? <TableCell>Удалить</TableCell> : '' }
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.hits.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.full_name}</TableCell>
                        <TableCell>{item.card_number}</TableCell>
                        
                        <TableCell>
                          <Link
                            to={"readers/" + item.id}
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              value={item.id}
                            >
                              Редактировать
                            </Button>
                          </Link>
                        </TableCell>
                        {isAdmin ? <TableCell>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => onDelete(item.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell> : '' }
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>
        </Container>
      </div>
    );
  }
}
