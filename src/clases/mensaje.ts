export class mensaje{
  fecha:string;
  titulo:string;
  mensajeTica:string;
  mensajeMuni:string;
  mensajeLosa:string;

  constructor(fecha, titulo, mensajeTica, mensajeMuni, mensajeLosa){
    this.fecha = fecha;
    this.titulo = titulo;
    this.mensajeTica= mensajeTica;
    this.mensajeMuni= mensajeMuni;
    this.mensajeLosa= mensajeLosa;
  }

}
