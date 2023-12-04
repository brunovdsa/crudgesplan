import { useEffect, useState } from 'react';
import './App.scss';
import { Header } from './components/Header/Header';
import { Table } from './components/Table/Table';
import { SupplierDataProps } from './interfaces/interfaces';
import { API_URL } from './services/api';
import { ModalNewSupplier } from './components/Modal/ModalNewSupplier/ModalNewSupplier';
import { ModalUpdateSupplier } from './components/Modal/ModalUpdateSupplier/ModalUpdateSupplier';
import { ModalDeleteSupplier } from './components/Modal/DeleteSupplier/ModalDeleteSupplier';

function App() {
  const [checkedId, setCheckedId] = useState<number>(0);
  const [tableData, setTabelData] = useState<Array<SupplierDataProps>>();
  const [supplierData, setSupplierData] = useState<SupplierDataProps>({
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    tipoFornecedor: 'selecione',
    observacao: '',
    favorite: false,
  });
  const [toggleEnableButton, setToggleEnableButton] = useState<boolean>(true);
  const [modalNewSupplierIsActive, setModalNewSupplierIsActive] =
    useState<boolean>(false);
  const [modalUpdateClientIsActive, setModalUpdateClientIsActive] =
    useState(false);
  const [modalDeleteClienteIsActive, setModalDeleteClienteIsActive] =
    useState(false);

  //LISTA NA TABLE OS RESULTADOS DE GET
  const loadTable = async () => {
    try {
      const response = await fetch(API_URL);
      const results = await response.json();
      setTabelData(results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTable();
  }, []);

  function toggleIsFavorite(id: number) {
    if (id === checkedId) {
      setCheckedId(0);
    } else {
      setCheckedId(id);
    }
    if (tableData !== undefined) {
      let firstItem: any;
      console.log('FIRST ITEM: ', firstItem);
      const filteredItems = tableData.filter((item) => {
        if (item.id === id) {
          firstItem = [item];
          return false;
        }
        return true;
      });
      setTabelData([...firstItem, ...filteredItems]);
    }
  }

  // CHECK checkedId CHECKBOX
  const handleCheckedId = (id: number) => {
    if (id === checkedId) {
      setCheckedId(0);
    } else {
      setCheckedId(id);
    }

    checkedId !== 0
      ? setToggleEnableButton(true)
      : setToggleEnableButton(false);
  };

  // MODAL NOVO CLIENTE
  const handleModalNewSupplier = async () => {
    setSupplierData({
      id: 0,
      nome: '',
      email: '',
      telefone: '',
      tipoFornecedor: 'selecione',
      observacao: '',
      favorite: false,
    });
    setModalNewSupplierIsActive(!modalNewSupplierIsActive);

    await loadTable();
  };

  // MODAL UpdateAR CLIENTE
  const handleModalUpdateSupplier = async () => {
    const fetchData = async (url: string) => {
      try {
        const response = await fetch(url);
        const results = await response.json();
        setSupplierData(results);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(`${API_URL}/${checkedId}`);

    setModalUpdateClientIsActive(!modalUpdateClientIsActive);
    await loadTable();
  };

  //MODAL DELETAR CLIENTE
  const handleModalDeleteSupplier = async () => {
    setModalDeleteClienteIsActive(!modalDeleteClienteIsActive);
    await loadTable();
  };

  //CONTROLE FORM INPUTS
  const inputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSupplierData({
      ...supplierData,
      [e.target.name]: value,
    });
  };

  return (
    <div>
      <Header
        checkedId={checkedId}
        supplierData={supplierData}
        toggleEnableButton={toggleEnableButton}
        handleModalNewClient={handleModalNewSupplier}
        handleModalEditClient={handleModalUpdateSupplier}
        handleDeleteSelectedCliente={handleModalDeleteSupplier}
      />
      <main className='table-wrapper'>
        {tableData && (
          <Table
            tableData={tableData}
            supplierData={supplierData}
            handleCheckedId={handleCheckedId}
            loadTable={loadTable}
            toggleIsFavorite={toggleIsFavorite}
          />
        )}
        <ModalNewSupplier
          supplierData={supplierData}
          inputChanges={inputChanges}
          handleModalNewSupplier={handleModalNewSupplier}
          modalNewSupplierIsActive={modalNewSupplierIsActive}
          loadTable={loadTable}
        />
        <ModalUpdateSupplier
          supplierData={supplierData}
          inputChanges={inputChanges}
          handleModalUpdateSupplier={handleModalUpdateSupplier}
          modalUpdateSupplierIsActive={modalUpdateClientIsActive}
          loadTable={loadTable}
        />
        <ModalDeleteSupplier
          checkedId={checkedId}
          inputChanges={inputChanges}
          handleDeleteSelectedSupplier={handleModalDeleteSupplier}
          modalDeleteSupplierIsActive={modalDeleteClienteIsActive}
          handleCheckedId={handleCheckedId}
        />
      </main>
    </div>
  );
}

export default App;
