import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { selectAuthLoading } from '../../../../redux/loading.slice';
import { createUserWithNameAndPassword } from '../../../../redux/user/user.slice';
import AuthMessage from '../../../layout/AuthMessage';

import styles from '../AuthMenu.module.sass'


const Register = ({ register, isAuthenticated, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { email, name, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    register({ name, password, email })
  };


  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'> Create Your Account</p>
      <AuthMessage isLoading={isLoading} />
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className={`${styles.btn} ${styles.primary}`} value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/auth/with-password/login'>Sign In</Link>
      </p>
      <Link to='/auth'>Choose another auth method</Link>
    </>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  isLoading: selectAuthLoading(state).isLoading
})

const mapDispatchToProps = (dispatch) => ({
  register: (credentials) => dispatch(createUserWithNameAndPassword(credentials))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
