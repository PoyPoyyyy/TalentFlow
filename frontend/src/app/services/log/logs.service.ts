import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private apiUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {}

  /*
  * Récupère les logs avec pagination
  * @input : page (number) - La page à récupérer.
  *       limit (number) - Le nombre de logs par page.
  * @output : Observable<any[]> - Un tableau d'objets contenant les logs.
  *
  */
  getLogs(page: number, limit: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  /*
  * Récupère le nombre total de logs pour la pagination
  * @input : aucun
  * @output : Observable<number> - Le nombre total de logs.
  */
  getLogsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  /*
  * Crée un nouveau log
  * @input : userId (number) - L'identifiant de l'utilisateur qui a créé le log.
  *        title (string) - Le titre du log.
  *       content (string) - Le contenu du log.
  * @output : Observable<any> - La réponse de l'API, qui pourrait être un message de confirmation ou une erreur.
  * 
  */
  createLog(userId: number, title: string, content: string): Observable<any> {
    const logData = { user_id: userId, title, content };
    return this.http.post(`${this.apiUrl}`, logData);
  }
}
