import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private myAppUrl = 'https://localhost:7049/';
  private myApiUrl = 'api/Alumno/';

  constructor(private http: HttpClient) { }

  getListaAlumno(): Observable<any>
  {
    console.log("Ruta->",this.myAppUrl + this.myApiUrl);
    return this.http.get(this.myAppUrl + this.myApiUrl); //llamado a la API .NET
    //return this.http.get(this.myapiUrl)
  }

  deleteAlumno(id: number):Observable<any>
  {
    return this.http.delete(this.myAppUrl + this.myApiUrl +id); //llamado a la API .NET
  }

  saveAlumno(Alumno: any):Observable<any>
  {
    console.log("Ruta->",this.myAppUrl + this.myApiUrl + Alumno);
    return this.http.post(this.myAppUrl + this.myApiUrl, Alumno).pipe(
      catchError(this.handleError)
    ); //llamado a la API .NET
  }
  
  updateAlumno(id: number, alumno: any): Observable<any> {
    const url = `${this.myAppUrl}${this.myApiUrl}${id}`;
    console.log("Ruta ->", url);

    return this.http.put(url, alumno).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
       `Código de estado del servidor: ${error.status}, ` +
       `Mensaje de error: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(error.error || 'Error en el servidor, por favor inténtelo de nuevo más tarde.');
  }
}
