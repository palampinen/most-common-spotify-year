import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './Modal.scss';

const Modal = ({ children, className, rest }) => (
  <div className={classnames('modal', className)} {...rest}>
    <div className="modal__content">{children}</div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node,
};

Modal.defaultProps = {
  children: undefined,
};

export default Modal;
