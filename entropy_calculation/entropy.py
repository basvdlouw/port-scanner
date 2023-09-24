import numpy as np
from collections import Counter
from scipy.stats import norm

# Parameters
mu = 10  # Mean of the normal distribution for scan results
sigma = 5  # Standard deviation of the normal distribution for scan results
num_scans = 10  # Number of simulated scans
exp_parameter = 200  # Decay parameter for the exponential distribution
num_ports = 1000  # Number of ports being scanned

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
        identified_open_ports.append(set(selected_ports))
    else:
        # If the scan result is non-positive, there are no open ports in this scan
        identified_open_ports.append(set([]))

# Initialize a variable to store the total entropy
total_entropy = 0.0

# Calculate the entropy for each set of possible open ports
for ports in identified_open_ports:
    if len(ports) > 0:  # Check if the list is not empty
        # Calculate the probability distribution for this set of ports based on the exponential distribution
        port_probs = np.exp(-np.arange(num_ports + 1) / exp_parameter)
        port_probs /= port_probs.sum()  # Normalize the probabilities

        # Calculate entropy using the probability distribution for open ports
        entropy_open_ports = -np.sum([p * np.log2(p) if p > 0 else 0 for p in port_probs])

        # Calculate entropy using the probability distribution for scan results
        entropy_scan_results = -np.log2(norm.pdf(scans[identified_open_ports.index(ports)], loc=mu, scale=sigma))

        # Combine both entropies
        combined_entropy = entropy_open_ports + entropy_scan_results

        # Add to the total entropy
        total_entropy += combined_entropy
# Calculate the average entropy
average_entropy = total_entropy / num_scans

print("Average Entropy:", average_entropy)
