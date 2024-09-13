import React, { useState } from 'react';
import './CalendarioInteractivo.css';

function Calendario() {
  const [fecha, setFecha] = useState(new Date());
  const [mes, setMes] = useState(fecha.getMonth());
  const [año, setAño] = useState(fecha.getFullYear());
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMes = new Date(año, mes + 1, 0).getDate();

  const primerDiaMes = new Date(año, mes, 1);
  const primerDiaSemana = primerDiaMes.getDay();
  const diaHoy = fecha.getDate();

  const cambiarMes = (direccion) => {
    if (direccion === 'anterior') {
      if (mes === 0) {
        setMes(11);
        setAño(año - 1);
      } else {
        setMes(mes - 1);
      }
    } else if (direccion === 'siguiente') {
      if (mes === 11) {
        setMes(0);
        setAño(año + 1);
      } else {
        setMes(mes + 1);
      }
    }
  };

  const volverAlMesActual = () => {
    setMes(fecha.getMonth());
    setAño(fecha.getFullYear());
  };

  const abrirPopup = (dia) => {
    setMostrarPopup(true);
    setDiaSeleccionado(dia);
  };

  const cerrarPopup = () => {
    setMostrarPopup(false);
    setDiaSeleccionado(null);
  };

  return (
    <div className="calendario">
      <h1>{meses[mes]} {año}</h1>
        <div className="botones">
          <button onClick={() => cambiarMes('anterior')}>Anterior</button>
          <button onClick={volverAlMesActual}>Hoy</button>
          <button onClick={() => cambiarMes('siguiente')}>Siguiente</button>
        </div>
        <table>
          <thead>
            <tr>
              {diasSemana.map((dia, index) => (
                <th key={index} className="text-center">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, semana) => (
              <tr key={semana}>
                {Array.from({ length: 7 }, (_, dia) => {
                  const diaMes = semana * 7 + dia - primerDiaSemana + 1;
                  if (diaMes < 1 || diaMes > diasMes) {
                    return <td key={dia} className="text-center"></td>;
                  }
                  const esHoy = diaMes === diaHoy && mes === fecha.getMonth() && año === fecha.getFullYear();
                  return (
                    <td
                      key={dia}
                      className="text-center"
                      style={esHoy ? { backgroundColor: '#FFC5C5' } : {}}>
                      <button onClick={() => abrirPopup(diaMes)}>{diaMes}</button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {mostrarPopup && (
          <div className="popup">
            <div className="popup-content">
              <button className="cerrar-popup" onClick={cerrarPopup}>X</button>
              <p>Hola Mundo, hoy es el dia {diaSeleccionado}</p>
            </div>
          </div>
        )}
      </div>
      //kieeeeeeeeeeeee
  );
}

export default Calendario;
