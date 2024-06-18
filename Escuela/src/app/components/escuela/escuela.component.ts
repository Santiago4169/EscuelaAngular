import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2' 


@Component({
  selector: 'app-escuela',
  templateUrl: './escuela.component.html',
  styleUrls: ['./escuela.component.css']
})
export class EscuelaComponent implements OnInit {

  formAlumno: FormGroup;
  accion = 'agregar';
  codigoAlumno : number | undefined;
  listaAlumno: any[] =[
  ];
  fileToUpload: any; 
  alumnoAEditar: any | null = null;
 

  constructor(private _snackBar: MatSnackBar, private fb: FormBuilder, private _alumnoService: AlumnoService) { 
    this.formAlumno = this.fb.group({
      codigoAlumno:['', [Validators.required, Validators.maxLength(50), Validators.minLength(3),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      nombreAlumno: ['',[Validators.required, Validators.maxLength(50), Validators.minLength(5),Validators.pattern(/^[a-zA-Z\s]*$/)]],
      edadAlumno: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      semestreAlumno: ['',[Validators.required, Validators.maxLength(3), Validators.minLength(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      generoAlumno: ['',[Validators.required, Validators.maxLength(16), Validators.minLength(3)]],
      codigoCarrera1:['', [Validators.required, Validators.maxLength(50), Validators.minLength(3),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }

  ngOnInit(): void {
    this.obtenerAlumno();
  }

  obtenerAlumno()
  {
    this._alumnoService.getListaAlumno().subscribe(data =>{
      console.log("Data->",data);
      this.listaAlumno = data;
    }, error =>{
      console.log("Error", error);
    });
  }

  deleteAlumno(id: number)
  {
    this.showConfirmationAlert("¿Eliminar?","¡No podrás revertir esto!",'warning', "¡Confirmar!","Cancelar" 
    ).then((result) => {
      if (result.isConfirmed) {
        this._alumnoService.deleteAlumno(id).subscribe(data =>{
        this.obtenerAlumno();
      this.showAlert("¡Eliminado!","Se elimino correctamnete.",'success');
      }, error =>{
        console.log("Error", error);
        if(error.status === 400){
          this.showAlert("Error", "Hubo un problema con la solicitud. Por favor, comuniquese con el administrador.", "error");
        }
      });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      this.showAlert("Cancelado", "Sus datos estan a salvo 🙂",'success');
      }
    });
  }

  addAlumno() {
    console.log("Form -->", this.formAlumno);
    const Alumno: any = {
      codigoAlumno: this.formAlumno.get('codigoAlumno')?.value,
      nombreAlumno: this.formAlumno.get('nombreAlumno')?.value,
      edadAlumno: this.formAlumno.get('edadAlumno')?.value,
      semestreAlumno: this.formAlumno.get('semestreAlumno')?.value,
      generoAlumno: this.formAlumno.get('generoAlumno')?.value,
      codigoCarrera1: this.formAlumno.get('codigoCarrera1')?.value,
    };
  
    if (this.codigoAlumno === undefined) {
      Swal.fire({
        title: "¿Guardar?",
        text: "¡Está seguro de guardar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Confirmar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this._alumnoService.saveAlumno(Alumno).subscribe(data => {
            this.showAlert("Agregado","El alumno ha sido agregado con éxito.",'success');
            this.formAlumno.reset();
            this.obtenerAlumno();
            this.codigoAlumno = undefined;
            this.accion = 'Agregar';
          }, error => {
            console.log("Error objeto:", error.error);
            if (error.error === 'El alumno ya existe en la base de datos.') {
            this.showAlert("Error","¡El alumno ya existe! :(",'error');
            } else if (error.error === 'El código de carrera no existe.') {
            this.showAlert("Error", "Ese carrera no existe :( !Por favor, ingrese otro codigo!",'error');
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
         this.showAlert("Cancelado","No se agrego el Alumno 🙂",'success' );
        }
      });
    }
  }

  updateAlumno() {
    if (this.alumnoAEditar) {
      const updatedAlumno: any = {
        codigoAlumno: this.formAlumno.get('codigoAlumno')?.value,
        nombreAlumno: this.formAlumno.get('nombreAlumno')?.value,
        edadAlumno: this.formAlumno.get('edadAlumno')?.value,
        semestreAlumno: this.formAlumno.get('semestreAlumno')?.value,
        generoAlumno: this.formAlumno.get('generoAlumno')?.value,
        codigoCarrera1: this.formAlumno.get('codigoCarrera1')?.value,
      };
  
      Swal.fire({
        title: "¿Editar?",
        text: "¡Está seguro.!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Confirmar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this._alumnoService.updateAlumno(updatedAlumno.codigoAlumno, updatedAlumno).subscribe(data => {
            this.showAlert("Editado", "El alumno ha sido editado con éxito.", 'success');
            this.formAlumno.reset();
            this.obtenerAlumno();
            this.alumnoAEditar = null;
            this.accion = 'agregar';
            this.formAlumno.get('codigoAlumno')?.enable();
          }, error => {
            console.log("Error objeto:", error.error);
            if (error.error === 'El código de carrera no existe.') {
              this.showAlert("Error", "Ese carrera no existe :( !Por favor, ingrese otro código!", 'error');
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.showAlert("Cancelado", "No se editó el Alumno 🙂", 'success');
        }
      });
    }
  }
  


  showAlert(title: String, text: string, icon: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonColor: '#28a745'
    });
  }

  showConfirmationAlert(title: string, text: string, icon:'warning', confirmButtonText: string, cancelButtonText: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    });
  }

  prepareUpdate(Alumno: any) {
    this.accion = 'editar';
    this.formAlumno.get('codigoAlumno')?.disable();
    this.alumnoAEditar = Alumno;
    this.formAlumno.patchValue({
      codigoAlumno: Alumno.codigoAlumno,
      nombreAlumno: Alumno.nombreAlumno,
      edadAlumno: Alumno.edadAlumno,
      semestreAlumno: Alumno.semestreAlumno,
      generoAlumno: Alumno.generoAlumno,
      codigoCarrera1: Alumno.codigoCarrera1,
    });
  }
  
} 
