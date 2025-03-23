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

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.missionUrl);
  }

  getMissionById(id: number): Observable<Mission> {
    return this.http.get<Mission>(this.missionUrl + `/${id}`);
  }

  getMissionStatusStats(): Observable<any> {
    return this.http.get<any>(this.missionUrl);
  }

  getMissionsByEmployeeId(employeeId: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`http://localhost:3000/api/employees/${employeeId}/missions`);
  }

  addMission(mission: FormData): Observable<any> {
    return this.http.post<Mission>(this.missionUrl, mission);
  }

  updateMission(id: number, updatedMission: any): Observable<any> {
    return this.http.put(this.missionUrl + `/${id}`, updatedMission);
  }

  deleteMission(id: number): Observable<any> {
    return this.http.delete(this.missionUrl + `/${id}`, { responseType: 'text' });
  }
}
