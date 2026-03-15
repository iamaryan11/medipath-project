import heapq

# 1. The Road Network (Mock Graph of Chandigarh)
# Format: { 'Node': [('Neighbor', Weight/Distance), ...] }
city_graph = {
    'Sector 17': [('Sector 22', 1.5), ('Sector 16', 1.2), ('Sector 8', 2.0)],
    'Sector 22': [('Sector 17', 1.5), ('Sector 35', 2.1), ('Sector 23', 0.8)],
    'Sector 16': [('Sector 17', 1.2), ('Sector 15', 1.0), ('Sector 10', 1.5)],
    'Sector 35': [('Sector 22', 2.1), ('Sector 43', 1.8), ('Sector 34', 1.0)],
    'Sector 43': [('Sector 35', 1.8), ('ISBT 43', 0.5)],
    'Sector 8':  [('Sector 17', 2.0), ('Sector 9', 0.5)],
    # Add your hospitals as nodes connected to their nearest sectors
    'Civil Hospital-Sector 22': [('Sector 22', 0.2)], 
    'Mamta Child Health': [('Sector 17', 0.4)],
}

def dijkstra(graph, start_node, end_node):
    # Distances dictionary initialized to infinity
    distances = {node: float('infinity') for node in graph}
    distances[start_node] = 0
    
    # Priority queue: (distance, current_node)
    pq = [(0, start_node)]
    
    # To store the actual path
    predecessors = {node: None for node in graph}

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        # Optimization: skip if we found a better way already
        if current_distance > distances[current_node]:
            continue

        if current_node == end_node:
            break

        for neighbor, weight in graph.get(current_node, []):
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                predecessors[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))

    # Reconstruct the path
    path = []
    curr = end_node
    while curr is not None:
        path.append(curr)
        curr = predecessors[curr]
    
    return path[::-1], distances[end_node]

# Example Usage for your Demo
user_location = 'Sector 35'
target_hospital = 'Civil Hospital-Sector 22'

path, total_dist = dijkstra(city_graph, user_location, target_hospital)
print(f"📍 Shortest Route from {user_location} to {target_hospital}:")
print(f"🛣️ Path: {' -> '.join(path)}")
print(f"📏 Total Distance: {total_dist} km")