import React, { useReducer } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
  GET_CONTACTS,
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_CONTACTS,
  CLEAR_FILTER,
  CONTACT_ERROR,
} from '../types';

const ContactState = props => {
  const initialState = {
    contacts: null,
    current: null,
    filtered: null,
    error: null,
  };

  const [state, dispacth] = useReducer(contactReducer, initialState);

  // Get Contacts
  const getContacts = async () => {
    try {
      const res = await axios.get('/api/contacts');
      dispacth({
        type: GET_CONTACTS,
        payload: res.data,
      });
    } catch (err) {
      dispacth({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Add Contact
  const addContact = async contact => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/contacts', contact, config);
      dispacth({
        type: ADD_CONTACT,
        payload: res.data,
      });
    } catch (err) {
      dispacth({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Update Contact
  const updateContact = async contact => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.put(
        `/api/contacts/${contact._id}`,
        contact,
        config,
      );
      dispacth({
        type: UPDATE_CONTACT,
        payload: res.data,
      });
    } catch (err) {
      dispacth({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Delete Contact
  const deleteContact = async id => {
    try {
      await axios.delete(`/api/contacts/${id}`);
      dispacth({
        type: DELETE_CONTACT,
        payload: id,
      });
    } catch (err) {
      dispacth({
        type: CONTACT_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Clear Contacts
  const clearContacts = () => {
    dispacth({ type: CLEAR_CONTACTS });
  };

  // Set Current Contact
  const setCurrent = contact => {
    dispacth({
      type: SET_CURRENT,
      payload: contact,
    });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispacth({
      type: CLEAR_CURRENT,
    });
  };

  // Filter Contacts
  const filterContacts = text => {
    dispacth({
      type: FILTER_CONTACTS,
      payload: text,
    });
  };

  // Clear Filter
  const clearFilter = () => {
    dispacth({
      type: CLEAR_FILTER,
    });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
        getContacts,
        clearContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
