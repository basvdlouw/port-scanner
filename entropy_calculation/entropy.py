import numpy as np
from collections import Counter

# Parameters
mu = 10  # Mean of the normal distribution for scan results
sigma = 5  # Standard deviation of the normal distribution for scan results
num_scans = 100000  # Number of simulated scans
exp_parameter = 200  # Decay parameter for the exponential distribution
num_ports = 1000  # Number of ports being scanned
epsilon = 1e-10  # Small non-zero value to replace zero probabilities

# Simulate scans with a normal distribution
scans = np.random.normal(mu, sigma, num_scans)

# Initialize a list to store identified open ports in each scan
identified_open_ports = []

# Simulate the identification of open ports in each scan
for scan in scans:
    if scan > 0:
        # Round the scan result to the nearest whole number to represent the number of open ports
        x = round(scan)

        # Define probabilities for selecting ports using an exponential distribution
        port_probabilities = np.exp(-np.arange(num_ports + 1) / exp_parameter)

        # Randomly select open ports based on the defined probabilities
        selected_ports = np.random.choice(num_ports + 1, x, replace=False, p=port_probabilities / port_probabilities.sum())

        # Add the selected open ports to the list
        identified_open_ports.append(selected_ports)
    else:
        # If the scan result is non-positive, there are no open ports in this scan
        identified_open_ports.append([])

# Calculate the distribution of ports across all sets (excluding the current set)
total_port_counts = Counter()
for i in range(len(identified_open_ports)):
    total_port_counts.update(identified_open_ports[i])

# Calculate the entropy for each set of identified open ports based on the distribution of ports across all sets
entropies = []
for i in range(len(identified_open_ports)):
    current_set = set(identified_open_ports[i])

    # Subtract the current set from total_port_counts
    total_port_counts.subtract(current_set)

    total_ports = len(identified_open_ports) - 1  # Excluding the current set
    port_probabilities = [count / total_ports if count > 0 else epsilon for count in total_port_counts.values()]

    # Calculate the entropy of the current set relative to the others
    entropy = -sum(p * np.log2(p) for p in port_probabilities if p > 0)  # Exclude zero probabilities
    entropies.append(entropy)

# Calculate the average entropy for a set of identified open ports
average_entropy = sum(entropies) / len(entropies)

# Print the calculated entropies for each set
for i, entropy in enumerate(entropies):
    print(f"Entropy for Set {i + 1}: {entropy:.4f}")

# Print the average entropy
print(f"Average Entropy for Sets of Identified Open Ports: {average_entropy:.4f}")
