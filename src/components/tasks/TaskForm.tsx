import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { taskService, Task, TaskStatus } from '@/services/taskService';
import { userService, User } from '@/services/userService';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: TaskStatus.Pending,
    email: '',
    userId: undefined as number | undefined
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    if (isEdit && id) {
      loadTask(parseInt(id));
    }
  }, [id, isEdit]);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  };

  const loadTask = async (taskId: number) => {
    try {
      const task = await taskService.getTaskById(taskId);
      setFormData({
        name: task.name,
        description: task.description,
        status: task.status,
        email: task.email,
        userId: task.userId
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Falha em carregar a Tarefa",
        variant: "destructive"
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "O nome da tarefa é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "O email é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Por favor, insira um endereço de email válido",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await taskService.updateTask(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Tarefa atualizada com sucesso",
        });
      } else {
        await taskService.createTask(formData);
        toast({
          title: "Success",
          description: "Tarefa criada com sucesso",
        });
      }
      navigate('/tasks');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Task' : 'Create New Task'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Task Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Digite a descrição da tarefa"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status.toString()}
                onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) as TaskStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Pendente</SelectItem>
                  <SelectItem value="1">Em Progresso</SelectItem>
                  <SelectItem value="2">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">Atribuir a Usuário (Opcional)</Label>
              <Select
                value={formData.userId?.toString() ?? "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, userId: value === "none" ? undefined : parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem Atribuição</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : (isEdit ? 'Atualizar Tarefa' : 'Criar Tarefa')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tasks')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;
