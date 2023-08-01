import React, { useState, useEffect } from 'react'
import './contactPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Localhost } from '../../config/api';
import { Error, Success } from '../../components/Toast';
const ContactUs = () => {


  const [formData, setFormData] = useState({
    fname: '',
    lastname: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  };
  ///////////////////////////////////////////////:
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fetch data from the backend using Axios
    try {

      const response = await axios.post(
        `${Localhost}/api/email/send-email`,
        { formData },
        {
          withCredentials: true,
        }
      );

      // Process the response if needed
      console.log(response.data);
      // clear inputs 
      setFormData({
        fname: '',
        lastname: '',
        phone: '',
        email: '',
        message: '',

      });
      console.log(formData)
      Success('The Email Success')
    } catch (error) {
      //   // Handle any errors
      console.error(error);
      Error('The Email not send')
    }

  };

  return (
    <section className="contact-us">
      {/* <!-- section title --> */}
      <div className="row mt-5">
        <div className="col-md-4 col-12 text-center " style={{ marginTop: '150px' }}>
          <h2 style={{ fontSize: '52px', fontWeight: '400' }}>Get in touch</h2>
          <p style={{ fontSize: '23px', fontWeight: '400' }}>we'd love to hear from you</p>
        </div>
        {/* <!-- //////////////////////// -->
    <!-- contact form  --> */}
        <div className="col-md-1"></div>
        <div className="p-5  col-md-6 col-11 ml-md-5 m-auto  " style={{ backgroundColor: '#FAFAFA' }}>
          <form className="p-3" method='post' onSubmit={handleSubmit}>
            <div className="form-row d-lg-flex gap-2">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">First Name</label>
                <input type="text" className="form-control " id="inputEmail4" name='fname' value={formData.fname} onChange={handleChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Last Name</label>
                <input type="text" className="form-control" id="inputPassword4" name='lastname' value={formData.lastname} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress">Email</label>
              <input type="email" className="form-control" id="inputAddress" name='email' value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="inputAddress2">Mobile Number</label>
              <input type="text" className="form-control" id="inputAddress2" name='phone' value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="exampleFormControlTextarea1">Message</label>
              <textarea className="form-control message" id="exampleFormControlTextarea1" name='message' value={formData.message} onChange={handleChange} rows="4"></textarea>
              <div className="div-button">
                <button className="button3"> Send <FontAwesomeIcon icon={faPaperPlane} /></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactUs;