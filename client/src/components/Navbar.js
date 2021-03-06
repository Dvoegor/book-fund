import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();

  const cookie = Cookies.get('auth-token')
  const loggedIn = cookie ? true: false

  function logOff() {
    Cookies.remove('auth-token')
    window.location.href = '/'
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
          Книжный фонд научной библиотеки ВУЗа
          </Typography>
          {loggedIn ? <Button onClick={logOff} color="inherit">Выйти</Button> : '' }
        </Toolbar>
      </AppBar>
    </div>
  );
}
