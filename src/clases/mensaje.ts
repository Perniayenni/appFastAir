export class mensaje{
  id:number;
  fecha:string;
  titulo:string;
  mensajeTica:string;
  mensajeMuni:string;
  mensajeLosa:string;
  confirmacion:string;

  constructor(id, fecha, titulo, mensajeTica, mensajeMuni, mensajeLosa, confirmacion){
    this.id = id;
    this.fecha = fecha;
    this.titulo = titulo;
    this.mensajeTica= mensajeTica;
    this.mensajeMuni= mensajeMuni;
    this.mensajeLosa= mensajeLosa;
    this.confirmacion = confirmacion;
  }

}
