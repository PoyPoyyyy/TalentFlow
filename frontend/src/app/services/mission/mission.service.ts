import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mission } from '../../models/employees.model';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  private missionUrl = 'http://localhost:3000/api/missions';

  constructor(private http: HttpClient) { }

  /*
   * Récupère la liste complète des missions.
   * @input : aucun
   * @output : Observable<Mission[]> - La liste des missions sous forme d'un tableau d'objets Mission.
   */
  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.missionUrl);
  }

  /*
   * Récupère une mission par son identifiant.
   * @input : id (number) - L'identifiant de la mission.
   * @output : Observable<Mission> - L'objet Mission correspondant à l'ID donné.
   */
  getMissionById(id: number): Observable<Mission> {
    return this.http.get<Mission>(this.missionUrl + `/${id}`);
  }

  /*
   * Récupère une liste de missions
   * @input : aucun
   * @output : Observable<Mission[]> - Un tableau d'objets Mission
   */
  getMissionStatusStats(): Observable<any> {
    return this.http.get<any>(this.missionUrl);
  }

  /*
   * Récupère une liste de missions associées à un employé par son identifiant.
   * @input : employeeId (number) - L'identifiant de l'employé.
   * @output : Observable<Mission[]> - Un tableau d'objets Mission correspondant à l'ID donné.
   */
  getMissionsByEmployeeId(employeeId: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`http://localhost:3000/api/employees/${employeeId}/missions`);
  }

  /*
   * Ajoute une nouvelle mission.
   * @input : mission (FormData) - Les données de la mission à ajouter, envoyées sous forme de FormData.
   * @output : Observable<any> - La réponse de l'API, qui pourrait être un message de confirmation ou une erreur.
   */
  addMission(mission: FormData): Observable<any> {
    return this.http.post<Mission>(this.missionUrl, mission);
  }

  /*
   * Met à jour les informations d'une mission.
   * @input : id (number) - L'identifiant de la mission à mettre à jour.
   * updatedMission (any) - Les nouvelles données de la mission à mettre à jour.
   * @output : Observable<any> - La réponse de l'API, qui peut indiquer si la mise à jour a réussi ou échoué.
   */
  updateMission(id: number, updatedMission: any): Observable<any> {
    return this.http.put(this.missionUrl + `/${id}`, updatedMission);
  }

  /*
   * Supprime une mission par son identifiant.
   * @input : id (number) - L'identifiant de la mission à supprimer.
   * @output : Observable<any> - La réponse de l'API, généralement un message indiquant si la suppression a réussi.
   */
  deleteMission(id: number): Observable<any> {
    return this.http.delete(this.missionUrl + `/${id}`, { responseType: 'text' });
  }
}
