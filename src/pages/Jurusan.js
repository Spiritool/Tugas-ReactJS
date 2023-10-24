import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Mahasiswa() {
    const [jrs, setJrsn] = useState([]);
    const url = "http://localhost:3000/static/";
    useEffect(() => {
        fectData();
    }, []);
    const fectData = async () =>{
        const response1 = await axios.get('http://localhost:3000/api/jrs');
        const data1 = await response1.data.data;
        setJrsn(data1);
    }
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [nama_jurusan, setNama] = useState('');
    const [validation, setValidation] = useState({});
    const navigate = useNavigate();

    const handleNamaChange = (e) => {
        setNama(e.target.value);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            nama_jurusan: nama_jurusan
        };

        try {
            await axios.post('http://localhost:3000/api/jrs/store', formData);
            navigate('/jrsn');
            fectData();
        } catch (error) {
            console.error('Kesalahan: ', error);
            setValidation(error.response.data)
        }
    };

    //edit 
    const [editData, setEditData] = useState({
        id_j: null,
        nama_jurusan: '',
    })

    const [showEditModal, setShowEditModal] = useState(false);

    const handleShowEditModal = (data) => {
        setEditData(data);
        setShowEditModal(true);
        setShow(false);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditData(null);
    };
    const handleEditDataChange = (field, value) => {
        setEditData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('id_j', editData.id_j);
        formData.append('nama_jurusan', editData.nama_jurusan);

        try {
            await axios.patch(`http://localhost:3000/api/jrs/update/${editData.id_j}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate('/jrsn');
            fectData();
            setShowEditModal(false);
        } catch (error) {
            console.error('Kesalahan:', error);
            setValidation(error.response.data);
        };

    }


    const handleDelete = (id_j) => {
        axios
        .delete(`http://localhost:3000/api/jrs/delete/${id_j}`)
        .then((response) => {
            console.log('Data Berhasil Dihapus');

            const updateMhs = jrs.filter((item) => item.id_j !== id_j);
            setJrsn(updateMhs);
        })
        .catch((error) => {
            console.error('Gagal menghapus data', error);
            alert('Gagal menghapus data. silahkan coba lagi atau hubungi administrator')
        });
    };

    return (
        <Container>
        <Modal show={show} onHide={handleClose} >        
            <Modal.Header closeButton>
                <Modal.Title>Tambah Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nama Jurusan:</label>
                        <input type="text" className="form-control" value={nama_jurusan} onChange={handleNamaChange} /> 
                    </div>
                    <button onClick={handleClose} type="submit" className="btn btn-primary">Kirim</button>
                </form>
            </Modal.Body>
            
        </Modal>
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Nama Jurusan:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData ? editData.nama_jurusan : ''}
                      onChange={(e) => handleEditDataChange('nama_jurusan', e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                </form>
              </Modal.Body>
            </Modal>
            <Row>
                <Col>
                <h2>Data Mahasiswa</h2>
                <Button variant='primary' onClick={handleShow}>Tambah</Button>
                </Col>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Nama Jurusan</th>
                            {/* <th scope="col" colSpan={2}>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        { jrs.map((jr, index) => ( 
                            <tr>
                                <td>{ index +1}</td> 
                                <td>{ jr.nama_jurusan}</td>
                                <td><button onClick={() => handleShowEditModal(jr)} className='btn btn-sm btn-info'> Edit </button></td>
                                <td><button onClick={() => handleDelete(jr.id_j)} className='btn btn-sm btn-danger'> Hapus </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Row>
        </Container>
    );
}

export default Mahasiswa;