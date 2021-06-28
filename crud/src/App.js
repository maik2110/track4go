import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost/track4go/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado]=useState({
    id_usuario: '',
    nombre_usuario: '',
    cedula_usuario: '',
    telefono_usuario: '',
    mail_usuario: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setUsuarioSeleccionado((prevState)=>({
      ...prevState,
      [name]:value
    }))
    console.log(usuarioSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("nombre_usuario", usuarioSeleccionado.nombre_usuario);
    f.append("cedula_usuario", usuarioSeleccionado.cedula_usuario);
    f.append("telefono_usuario", usuarioSeleccionado.telefono_usuario);
    f.append("mail_usuario", usuarioSeleccionado.mail_usuario);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f, {params: {id_usuario: usuarioSeleccionado.id_usuario} })
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(usuario=>{
        if(usuario.id_usuario===usuarioSeleccionado.id_usuario){
          usuario.nombre_usuario=usuarioSeleccionado.nombre_usuario;
          usuario.cedula_usuario=usuarioSeleccionado.cedula_usuario;
          usuario.telefono_usuario=usuarioSeleccionado.telefono_usuario;
          usuario.mail_usuario=usuarioSeleccionado.mail_usuario;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("nombre_usuario", usuarioSeleccionado.nombre_usuario);
    f.append("cedula_usuario", usuarioSeleccionado.cedula_usuario);
    f.append("telefono_usuario", usuarioSeleccionado.telefono_usuario);
    f.append("mail_usuario", usuarioSeleccionado.mail_usuario);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id_usuario: usuarioSeleccionado.id_usuario} })
    .then(response=>{
      setData(data.filter(usuario=>usuario.usuario_id!==usuarioSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarUsuario=(usuario, caso)=>{
    setUsuarioSeleccionado(usuario);
    
    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()

  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App" style={{textAlign: 'left'}}>
      
      <br />
      <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-1">
          </div>
          <div class="col-md-10">
          <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Telefono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(usuario=>(
            <tr key={usuario.id}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.cedula_usuario}</td>
              <td>{usuario.telefono_usuario}</td>
              <td>{usuario.mail_usuario}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarUsuario(usuario, "Editar")} >Editar</button>
                <button className="btn btn-danger" onClick={()=>seleccionarUsuario(usuario, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
          <div class="col-md-1">
          </div>
        </div>
      </div>
      
    <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre de usuario: </label>
          <br />
          <input type="text" className="form-control" name="nombre_usuario" onChange={handleChange}/>
          <br />
          <label>Cedula: </label>
          <br />
          <input type="text" className="form-control" name="cedula_usuario" onChange={handleChange}/>
          <br />
          <label>Teléfono: </label>
          <br />
          <input type="text" className="form-control" name="telefono_usuario" onChange={handleChange}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="mail" className="form-control" name="mail_usuario" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()} >Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre de usuario: </label>
          <br />
          <input type="text" className="form-control" name="nombre_usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.nombre_usuario} />
          <br />
          <label>Cedula: </label>
          <br />
          <input type="text" className="form-control" name="cedula_usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.cedula_usuario} />
          <br />
          <label>Teléfono: </label>
          <br />
          <input type="text" className="form-control" name="telefono_usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.telefono_usuario}/>
          <br />
          <label>Email: </label>
          <br />
          <input type="mail" className="form-control" name="mail_usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.mail_usuario}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()} >Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Usuario {usuarioSeleccionado && usuarioSeleccionado.nombre_usuario}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
         
    </div>
  );
}

export default App;
