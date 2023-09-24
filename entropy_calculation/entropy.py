import numpy as np
from itertools import combinations
from collections import Counter

mu = 10
sigma = 5
num_scans = 2000000

scans = np.random.normal(mu, sigma, num_scans)
roundedIdentifiedOpenPorts = []

for scan in scans:
    if scan > 0:
        x = round(scan)
        port_probabilities = np.exp(-np.arange(1001) / 200)  # Exponential distribution probabilities
        selected_ports = np.random.choice(1001, x, replace=False, p=port_probabilities / port_probabilities.sum())
        roundedIdentifiedOpenPorts.append(sorted(selected_ports))
    else:
        roundedIdentifiedOpenPorts.append([])

# Calculate the joint entropy of all combinations
joint_entropy = 0.0

for combination in combinations(roundedIdentifiedOpenPorts, num_scans):
    combined_ports = [port for ports_combination in combination for port in ports_combination]
    prob_distribution = Counter(combined_ports)
    total_samples = len(combined_ports)

    entropy = -sum((count / total_samples) * np.log2(count / total_samples) for count in prob_distribution.values())
    joint_entropy += entropy

print("Joint Entropy:", joint_entropy)
