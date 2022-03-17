import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, withStyles } from '@material-ui/core/styles';
import ModalProduct from '../../products/ModalProduct'
import { IconButton, Divider } from '@material-ui/core';

const dialogStyles = theme => ({
  paper: {
    minWidth: '60%'
  },
});

const dialogContentStyles = theme => ({
  root: {
    padding: theme.spacing(2)
  }
})

const DialogContentWithStyle = withStyles(dialogContentStyles)(DialogContent);

const CustomDialog = withStyles(dialogStyles)(Dialog);

export default function ResponsiveDialog(props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const {title, render} = props;
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>
      <CustomDialog 
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {/*<DialogTitle id="responsive-dialog-title">{title}
        <IconButton aria-label="close" style={{right: 10, position: 'absolute'}} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
  </DialogTitle>*/}
        <Divider />
        <DialogContentWithStyle style={{width: 500}}>
          {render()}
        </DialogContentWithStyle>
      </CustomDialog>
    </div>
  );
}