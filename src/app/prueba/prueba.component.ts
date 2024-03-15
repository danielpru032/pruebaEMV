import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Task {
  id: number;
  description: string;
  count?: number;
}

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.scss',
})
export class PruebaComponent {
  tasks: Task[] = [];
  taskForm: FormGroup;
  editingTaskId: number | null = null;
  editingTaskCount: number | null = null;
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      description: ['', Validators.required],
    });
  }
  addTask() {
    if (this.taskForm.valid) {
      const newDescription = this.taskForm.value.description.trim();
      if (this.isDescriptionUnique(newDescription)) {
        const newTask: Task = {
          id: this.tasks.length + 1,
          description: newDescription,
          count: 0,
        };
        //console.log('Nueva tarea:', newTask);
        this.tasks.push(newTask);
        this.taskForm.reset();
      } else {
        console.log('La descripción ya existe.');
      }
    }

    console.table(this.tasks);
  }

  isDescriptionUnique(newDescription: string): boolean {
    const isUnique = !this.tasks.some(
      (task) => task.description.trim() === newDescription
    );
    if (!isUnique) {
      this.taskForm.get('description')?.setErrors({ notUnique: true });
    }

    return isUnique;
  }
  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    console.table(this.tasks);
  }
  editTask(task: Task) {
    this.editingTaskId = task.id;
    this.editingTaskCount = task.count !== undefined ? task.count : null;

    this.taskForm.setValue({
      description: task.description,
    });
  }
  updateTask() {
    if (this.taskForm.valid && this.editingTaskId && this.editingTaskCount) {
      const index = this.tasks.findIndex(
        (task) => task.id === this.editingTaskId
      );
      if (index > -1) {
        this.tasks[index] = {
          id: this.editingTaskId,
          description: this.taskForm.value.description,
          count: this.editingTaskCount,
        };

        this.editingTaskId = null;
        this.taskForm.reset();
      }
    }
    console.table(this.tasks);
  }
  voteForTask(task: Task) {
    task.count = 1; // Establece el contador de la tarea a 1
    console.table(this.tasks);
  }
}
