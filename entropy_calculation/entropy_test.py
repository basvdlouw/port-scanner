import numpy as np
from scipy.stats import geom

num_ports = 10  # Total number of ports to scan
average_open_ports = 5  # Average number of open ports per scan
success_prob = average_open_ports / num_ports

open_ports = np.array([1, 2, 3])

# Calculate the probabilities of each port being open based on the geometric distribution
port_probabilities = [geom.pmf(port, success_prob) for port in open_ports]

# Calculate the Shannon entropy for the specific port scan
shannon_entropy = -np.sum(port_probabilities * np.log2(port_probabilities))

print(shannon_entropy)
