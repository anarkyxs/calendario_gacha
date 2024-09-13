
import React, { useState, useEffect } from 'react';
import './CalendarioInteractivo.css';
import genshin from '../img/genshin ico.jpg';
import hsr from '../img/hsr ico.jpeg';
import wuwa from '../img/wuwa ico.png';
import zzz from '../img/zzz ico.webp';


function Calendario() {
  // estado actual del calendario
  const [fecha] = useState(new Date());
  const [mes, setMes] = useState(fecha.getMonth());
  const [año, setAño] = useState(fecha.getFullYear());
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [eventos, setEventos] = useState(JSON.parse(localStorage.getItem('eventos')) || []);
  const [eventoEditando, setEventoEditando] = useState(null);

  // constantes para los nombres de los meses y dias de la semana
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diasMes = new Date(año, mes + 1, 0).getDate();

  // primer dia del mes actual
  const primerDiaMes = new Date(año, mes, 1);
  const primerDiaSemana = primerDiaMes.getDay();
  // dia actual
  const diaHoy = fecha.getDate();

  // funciones para cambiar el mes
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

  // funcion para volver al mes actual
  const volverAlMesActual = () => {
    setMes(fecha.getMonth());
    setAño(fecha.getFullYear());
  };
  // funciones para manejar el popup
  const abrirPopup = (dia, mes, año) => {
    setMostrarPopup(true);
    setDiaSeleccionado({ dia, mes, año });
  };

  const cerrarPopup = () => {
    setMostrarPopup(false);
    setDiaSeleccionado(null);
  };

  useEffect(() => {
    localStorage.setItem('eventos', JSON.stringify(eventos));
  }, [eventos]);

  return (
    <div className="calendario">
      {/* titulo con el mes y el a o actual */}
      <h1>{meses[mes]} {año}</h1>
      {/* botones para cambiar el mes */}
      <div className="botones">
        <button onClick={() => cambiarMes('anterior')}>Anterior</button>
        <button onClick={volverAlMesActual}>Hoy</button>
        <button onClick={() => cambiarMes('siguiente')}>Siguiente</button>
      </div>
      {/* tabla del calendario */}
      <table>
        <thead>
          <tr>
            {/* dias de la semana */}
            {diasSemana.map((dia, index) => (
              <th key={index} className="text-center">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* semanas del mes */}
          {Array.from({ length: 6 }, (_, semana) => (
            <tr key={semana}>
              {/* dias de la semana */}
              {Array.from({ length: 7 }, (_, dia) => {
                const diaMes = semana * 7 + dia - primerDiaSemana + 1;
                if (diaMes < 1 || diaMes > diasMes) {
                  return <td key={dia} className="text-center"></td>;
                }
                const esHoy = diaMes === diaHoy && mes === fecha.getMonth() && año === fecha.getFullYear();
                const diaEventos = eventos.filter((evento) => evento.dia === diaMes && evento.mes === mes && evento.año === año);
                return (
                  <td
                    key={dia}
                    className="text-center"
                    style={esHoy ? { backgroundColor: '#FFC5C5' } : {}}>
                    <button onClick={() => abrirPopup(diaMes, mes, año)}>
                      {diaMes}
                      <div className="eventos">
                        {diaEventos.map((evento, index) => (
                          <div
                            key={index}
                            style={{ backgroundColor: evento.color }}
                          >
                            <img src={evento.icono} alt={evento.titulo} width="20" height="20" style={{ marginRight: '10px' }} />
                            <p>{evento.titulo}</p>
                            <button onClick={() => setEventoEditando(evento)}>Editar</button>
                            <button onClick={() => {
                              const nuevosEventos = eventos.filter((e) => e !== evento);
                              setEventos(nuevosEventos);
                            }}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* popup para mostrar la informaci n del d a seleccionado */}
      {mostrarPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="cerrar-popup" onClick={cerrarPopup}>X</button>
            {eventoEditando ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const titulo = e.target.titulo.value;
                const descripcion = e.target.descripcion.value;
                const color = e.target.color.value;
                const icono = e.target.icono.value;
                const nuevosEventos = eventos.map((evento) =>
                  evento === eventoEditando
                    ? { ...evento, titulo, descripcion, color, icono }
                    : evento
                );
                setEventos(nuevosEventos);
                setEventoEditando(null);
                cerrarPopup();
              }}>
                <label>
                  Titulo:
                  <input type="text" name="titulo" defaultValue={eventoEditando.titulo} />
                </label>
                <br />
                <label>
                  Descripcion:
                  <textarea name="descripcion" defaultValue={eventoEditando.descripcion} />
                </label>
                <br />
                <label>
                  Color:
                  <input type="color" name="color" defaultValue={eventoEditando.color} />
                </label>
                <br />
                <label>
                  Icono:
                  <select name="icono" defaultValue={eventoEditando.icono}>
                    <option value={genshin}>Genshin</option>
                    <option value={hsr}>HSR</option>
                    <option value={wuwa}>Wuwa</option>
                    <option value={zzz}>ZZZ</option>
                  </select>
                </label>
                <br />
                <button type="submit">Editar</button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const titulo = e.target.titulo.value;
                const descripcion = e.target.descripcion.value;
                const color = e.target.color.value;
                const icono = e.target.icono.value;
                const nuevosEventos = [...eventos, { titulo, descripcion, color, icono, dia: diaSeleccionado.dia, mes: diaSeleccionado.mes, año: diaSeleccionado.año }];
                setEventos(nuevosEventos);
                cerrarPopup();
              }}>
                <label>
                  Titulo:
                  <input type="text" name="titulo" />
                </label>
                <br />
                <label>
                  Descripcion:
                  <textarea name="descripcion" />
                </label>
                <br />
                <label>
                  Color:
                  <input type="color" name="color" />
                </label>
                <br />
                <label>
                  Icono:
                  <select name="icono">
                    <option value={genshin}>Genshin</option>
                    <option value={hsr}>HSR</option>
                    <option value={wuwa}>Wuwa</option>
                    <option value={zzz}>ZZZ</option>
                  </select>
                </label>
                <br />
                <button type="submit">Crear</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default Calendario;
