
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { taskService, Task, TaskStatus } from '@/services/taskService';
import { Plus, Edit, Trash2 } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Falha em carregar as tarefas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza de que deseja excluir esta tarefa?')) return;

    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast({
        title: "Success",
        description: "Tarefa excluída com sucesso",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Falha ao excluir a tarefa",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    const variants = {
      [TaskStatus.Pending]: 'secondary',
      [TaskStatus.InProgress]: 'default',
      [TaskStatus.Completed]: 'default'
    } as const;

    const labels = {
      [TaskStatus.Pending]: 'Pendente',
      [TaskStatus.InProgress]: 'Em Progresso',
      [TaskStatus.Completed]: 'Concluída'
    };

    return (
      <Badge variant={variants[status]} className={
        status === TaskStatus.Completed ? 'bg-green-100 text-green-800' :
        status === TaskStatus.InProgress ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }>
        {labels[status]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Link to="/tasks/new">
          <Button className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Nova Tarefa</span>
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Nenhuma tarefa encontrada. Crie sua primeira tarefa!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  {getStatusBadge(task.status)}
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {task.email}
                  </p>
                  {task.user && (
                    <p className="text-sm text-gray-600">
                      <strong>Atribuído a:</strong> {task.user.name}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 pt-2">
                    <Link to={`/tasks/${task.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
