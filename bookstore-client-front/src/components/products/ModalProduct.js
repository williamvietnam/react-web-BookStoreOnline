import React from 'react';
import {Popover, Button} from 'antd';

function ModalProduct(props) {

  return (
    <Popover content={'content'} title="Title">
      <Button type="primary">Hover me</Button>
    </Popover> )

}

export { ModalProduct as default }