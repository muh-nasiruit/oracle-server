import {useState} from 'react';
import CSS from "./Oracle.module.css";
import img1 from "../../assets/ora-icon.png";
import axios from 'axios';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { emitData, listenerData } from '../../socket';
import { useEffect } from "react";


const ErrorToast = (msg) => {
    toast.error(msg);
}

const successToast = (msg) => {
    toast.success(msg);
}


const InitialState = () => {
    const [res, setRes] = useState("");
    const [lines, setLines] = useState([]);
    
    useEffect(() => {listenerData(setLines) }, [])

    const formik = useFormik({
        initialValues: {
            user: "",
            password: "",
            connectionString:""
        },
    })

    const fetchBtn = () => {
        const myUrl = 'http://localhost:4122/api/oracle-logs';
        axios.post(myUrl, formik?.values)
            .then((response) => {
                    setRes(response.data)
                    console.log('myData: ', response.data.rows);
                    emitData("Oracle Logs")
                    successToast("Connection Established Successfully");
            })
            .catch((error) => {
                console.log(error);
                ErrorToast("Connection Refused");
            })
    };
    return (
        <div className={CSS["main-container"]}>
            <div className={CSS["sign-up-container"]}>
                <div className={CSS["sign-up-title"]}>
                    <img src={img1} alt="" />
                    <span>Connect to the Oracle Server</span>
                </div>
                <form className={CSS["signup-form"]}>
                    <div className={CSS["resizing-input-fields"]}>
                        <label for="">User</label>
                        <input
                            type="text"
                            id="user"
                            name="user"
                            value={formik.values.user}
                            onChange={formik?.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.user && formik.errors.user ? (
                            <span className={CSS["error-message"]} >{formik.errors.user}</span>
                        ) : null}
                    </div>

                    <div className={CSS["resizing-input-fields"]}>
                        <label for="">Password</label>
                        <input type="password"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik?.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <span className={CSS["error-message"]} >{formik.errors.password}</span>
                        ) : null}
                    </div>
    

                    <div className={CSS["resizing-input-fields"]}>
                        <label for="" >connectionString</label>
                        <input type="text"
                            id="connectionString"
                            name="connectionString"
                            placeholder="host:port/service_name"
                            value={formik.values.connectionString}
                            onChange={formik?.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.connectionString && formik.errors.connectionString ? (
                            <span className={CSS["error-message"]} >{formik.errors.connectionString}</span>
                        ) : null}
                     

                     </div>
                    <div className={CSS["signup-btn"]}>
                        <input type="button"
                            style={{ opacity: formik.isValid ? 1 : 0.7 }}
                            disabled={!formik.isValid} name="da" value="Connect" onClick={() => fetchBtn()} />
                    </div>
                    </form>
                
            </div>
<br/>


    <div>
      
        {
        res && 
        <div id="my-table" className={CSS["users-table"]}>

              <table className='table'>
                  <thead className='table-dark'>
                  <tr>
                  <th scope='col'> Data </th>
                  </tr>
                  </thead>
                        {lines.map((rows, index) => (
                  <tbody>
                  <tr key={index}>
                      <td>{rows}</td>
                  </tr>
                  </tbody>))}
              </table>
      </div>
        }
  </div>
  
  

  </div>

    )}
  
    

export default InitialState;