import axios from 'axios';
import queryString from 'query-string';
import { MinecraftServerInterface, MinecraftServerGetQueryInterface } from 'interfaces/minecraft-server';
import { GetQueryInterface } from '../../interfaces';

export const getMinecraftServers = async (query?: MinecraftServerGetQueryInterface) => {
  const response = await axios.get(`/api/minecraft-servers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMinecraftServer = async (minecraftServer: MinecraftServerInterface) => {
  const response = await axios.post('/api/minecraft-servers', minecraftServer);
  return response.data;
};

export const updateMinecraftServerById = async (id: string, minecraftServer: MinecraftServerInterface) => {
  const response = await axios.put(`/api/minecraft-servers/${id}`, minecraftServer);
  return response.data;
};

export const getMinecraftServerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/minecraft-servers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMinecraftServerById = async (id: string) => {
  const response = await axios.delete(`/api/minecraft-servers/${id}`);
  return response.data;
};
