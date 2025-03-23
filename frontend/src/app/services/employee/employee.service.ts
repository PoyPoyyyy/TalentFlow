import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employees.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesUrl = 'http://localhost:3000/api/employees';
  constructor(private http: HttpClient) {}

  /*
   * Récupère la liste complète des employés.
   * @input : aucun
   * @output : Observable<Employee[]> - La liste des employés sous forme d'un tableau d'objets Employee.
   */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl);
  }

  /*
   * Récupère un employé par son identifiant.
   * @input : id (number) - L'identifiant de l'employé.
   * @output : Observable<Employee> - L'objet Employee correspondant à l'ID donné.
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeesUrl}/${id}`);
  }

  /*
   * Ajoute un nouvel employé.
   * @input : employeeData (FormData) - Les données de l'employé à ajouter, envoyées sous forme de FormData.
   * @output : Observable<any> - La réponse de l'API, qui pourrait être un message de confirmation ou une erreur.
   */
  addEmployee(employeeData: FormData): Observable<any> {
    return this.http.post(this.employeesUrl, employeeData);
  }

  /*
   * Met à jour les informations d'un employé.
   * @input : id (number) - L'identifiant de l'employé à mettre à jour.
   *         employeeData (any) - Les nouvelles données de l'employé à mettre à jour.
   * @output : Observable<any> - La réponse de l'API, qui peut indiquer si la mise à jour a réussi ou échoué.
   */
  updateEmployee(id: number, employeeData: any): Observable<any> {
    return this.http.put(`${this.employeesUrl}/${id}`, employeeData);
  }

  /*
   * Supprime un employé par son identifiant.
   * @input : id (number) - L'identifiant de l'employé à supprimer.
   * @output : Observable<any> - La réponse de l'API, généralement un message indiquant si la suppression a réussi.
   */
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.employeesUrl}/${id}`, { responseType: 'json' });
  }
}
