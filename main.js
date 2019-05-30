const jubilacion = 0.11;
const ley19032 = 0.11;
const obraSocial = 0.03;
const cuotaSindical = 0.03;
const presentismo = 0.11;

var koModel = {
  inputSueldo: ko.observable(''),
  inputHijos: ko.observable(''),
  inputAnos: ko.observable(''),
  arrayInfo: ko.observableArray(),
  arrayTotal: ko.observableArray(),

  calcHaber: () => {
    let date = moment().format('DD/MM/YYYY HH:mm');
    if (inputSueldoMask.unmaskedValue > 0){
      //sueldo
      let sueldo = parseFloat(inputSueldoMask.unmaskedValue);

      let jubi = sueldo * jubilacion;
      let obraSoc = sueldo * obraSocial;
      let cuotaSin = sueldo * cuotaSindical;
      let presente = sueldo * presentismo;

      //antiguedad
      let anti = 40;
      if (inputAnosMask.unmaskedValue > 0 > 0) {
        let anos = parseInt(inputAnosMask.unmaskedValue);
        anti = antiguedad(anos);
      }
      
      //asignacion
      let asig = 0;
      if (inputHijosMask.unmaskedValue > 0) {
        asig = asignacion(sueldo);
        asig = asig * parseInt(inputHijosMask.unmaskedValue);
      }

      let total = sueldo + presente + anti + asig;
      let deduc = jubi + obraSoc + cuotaSin;
      let totalNeto = total - deduc;

      //formateo
      sueldo = currencyFormat(sueldo);
      jubi = currencyFormat(jubi);
      obraSoc = currencyFormat(obraSoc);
      cuotaSin = currencyFormat(cuotaSin);
      presente = currencyFormat(presente);
      anti = currencyFormat(anti);
      asig = currencyFormat(asig);
      deduc = currencyFormat(deduc);
      total = currencyFormat(total);
      totalNeto = currencyFormat(totalNeto);

      koModel.arrayInfo([
        { detalle: 'SUELDO', haberes: sueldo, deducciones: ''},
        { detalle: 'JUBILACIÓN', haberes: '', deducciones: `-${jubi}`},
        { detalle: 'OBRA SOCIAL', haberes: '', deducciones: `-${obraSoc}`},
        { detalle: 'CUOTA SINDICAL', haberes: '', deducciones: `-${cuotaSin}`},
        { detalle: 'ANTIGÜEDAD', haberes: anti, deducciones: ''},
        { detalle: 'ASIGNACIÓN', haberes: asig, deducciones: ''},
        { detalle: 'PRESENTISMO', haberes: presente, deducciones: ''},
      ])

      koModel.arrayTotal([
        { fecha: date, total: total, deducciones: `-${deduc}`, totalNeto: totalNeto}
      ])
    }else {
      koModel.arrayInfo([]);
      koModel.arrayTotal([]);
    }
  }
}

const antiguedad = (anos) => {
  let anti;
  
  switch (true) {
    case (anos >= 1 && anos < 5):
      anti = 114;
      break;
    case (anos >= 5 && anos < 10):
      anti = 134;
      break;
    case (anos >= 10 && anos < 20):
      anti = 164;
      break;
    case (anos >= 20 && anos < 25):
      anti = 184;
      break;
    case (anos >= 25 && anos < 30):
      anti = 195;
      break;
    case (anos >= 30 && anos < 40):
      anti = 217;
      break;
    case (anos >= 40):
      anti = 300;
      break;
  }
  return anti;
}

const asignacion = (sueldo) => {
  let asig;

  switch (true) {
    case (sueldo >= 3000 && sueldo < 31000):
      asig = 2000;
      break;
    case (sueldo >= 31000 && sueldo < 46000):
      asig = 1300;
      break;
    case (sueldo >= 46000 && sueldo < 53000):
      asig = 800;
      break;
    case (sueldo >= 53000 && sueldo < 110000):
      asig = 400;
      break;
    default:
      asig = 0;
      break;
  }
  return asig;
}

const currencyFormat = (num) => {
  return (
    num
      .toFixed(2)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  ) 
}