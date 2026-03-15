import heapq
city_graph = {
    'Sector 17': [('Sector 22', 1.5), ('Sector 16', 1.2), ('Sector 8', 2.0)],
    # Added ('Civil Hospital-Sector 22', 0.2) to Sector 22's list
    'Sector 22': [('Sector 17', 1.5), ('Sector 35', 2.1), ('Sector 23', 0.8), ('Civil Hospital-Sector 22', 0.2)],
    'Sector 16': [('Sector 17', 1.2), ('Sector 15', 1.0), ('Sector 10', 1.5)],
    'Sector 35': [('Sector 22', 2.1), ('Sector 43', 1.8), ('Sector 34', 1.0)],
    'Sector 43': [('Sector 35', 1.8), ('ISBT 43', 0.5)],
    'Sector 8':  [('Sector 17', 2.0), ('Sector 9', 0.5)],
    
    'Civil Hospital-Sector 22': [('Sector 22', 0.2)], 
    'Mamta Child Health': [('Sector 17', 0.4)],

    'Sector 34': [('Sector 35', 1.0)],
    'Sector 23': [('Sector 22', 0.8)],
    'Sector 15': [('Sector 16', 1.0)],
    'Sector 10': [('Sector 16', 1.5)],
    'ISBT 43':   [('Sector 43', 0.5)],
    'Sector 9':  [('Sector 8', 0.5)]
}
def calculate_dijkstra(start_node, end_node):
    if start_node not in city_graph or end_node not in city_graph:
        return None, None
    
    distances = {node: float('infinity') for node in city_graph}
    distances[start_node] = 0
    pq = [(0, start_node)]
    predecessors = {node: None for node in city_graph}

    while pq:
        current_distance, current_node = heapq.heappop(pq)
        if current_distance > distances[current_node]: continue
        if current_node == end_node: break

        for neighbor, weight in city_graph.get(current_node, []):
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                predecessors[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))

    path = []
    curr = end_node
    while curr is not None:
        path.append(curr)
        curr = predecessors[curr]
    
    return path[::-1], distances[end_node]