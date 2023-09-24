import numpy as np
from collections import Counter

# Parameters
mu = 10  # Mean of the normal distribution for n of identified open ports
sigma = 5  # Standard deviation of the normal distribution for n of identified open ports
num_scans = 2000000  # Number of simulated port scans
exp_parameter = 180  # Decay parameter for the exponential distribution

# Simulate scans with a normal distribution
scans = np.random.normal(mu, sigma, num_scans)

# Initialize a list to store identified open ports in each scan
identified_open_ports = []

# Simulate the identification of open ports in each scan
for scan in scans:
    if scan > 0:
        # Round the n of identified open ports to the nearest integer to represent the number of open ports
        x = round(scan)

        # Define probabilities for selecting ports using an exponential distribution
        port_probabilities = np.exp(-np.arange(1001) / exp_parameter)

        # Randomly select open ports based on the defined probabilities
        selected_ports = np.random.choice(1001, x, replace=False, p=port_probabilities / port_probabilities.sum())

        # Add the selected open ports to the list as a set
        identified_open_ports.append(set(selected_ports))
    else:
        # If the scan is 0, there are no open ports identified during the scan
        identified_open_ports.append(set())

# Create a list of all unique ports detected across all scans
combined_ports = [port for ports_combination in identified_open_ports for port in ports_combination]

# Calculate the joint probability distribution of unique port combinations
joint_probability_distribution = Counter(tuple(combination) for combination in identified_open_ports)

# Initialize the joint entropy
joint_entropy = 0.0

# Calculate the entropy contribution from each unique port combination
for port_combination, count in joint_probability_distribution.items():
    # Calculate the probability of the port combination occurring across all scans
    probability = count / num_scans

    # Calculate the entropy contribution for this combination and accumulate it
    entropy_contribution = -probability * np.log2(probability)
    joint_entropy += entropy_contribution

# Print the calculated joint entropy
print("Joint Entropy:", joint_entropy)
