import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TeachersComponent } from './teachers/teachers.component';
import { ClassesComponent } from './classes/classes.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SessionsComponent } from './sessions/sessions.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'sessions', component: SessionsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
