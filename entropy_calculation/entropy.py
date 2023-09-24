from itertools import permutations

import numpy as np
from scipy.stats import entropy, norm, expon

# Parameters
mu = 10  # Mean of the normal distribution for scan results
sigma = 5  # Standard deviation of the normal distribution for scan results
num_scans = 2000000  # Number of simulated scans
exp_parameter = 200  # Decay parameter for the exponential distribution
num_ports = 1000  # Number of ports being scanne


def sample_amount_ports_open():
    samples = np.random.normal(mu, sigma, num_scans)
    number_of_ports_open = []
    for sample in samples:
        if sample <= 0:
            number_of_ports_open.append(0)
        else:
            number_of_ports_open.append(round(sample))
    return number_of_ports_open


def sample_ports_open(number_of_ports_open):
    identified_ports_array = []

    for ports_open in number_of_ports_open:
        if ports_open == 0:
            identified_ports_array.append([])
        else:
            ports = np.random.exponential(exp_parameter, ports_open)
            port_array = []
            for port in ports:
                port_array.append(round(port))
            identified_ports_array.append(port_array)

    return identified_ports_array


def probability_of_number(number):
    return norm.cdf(number+0.49, loc=mu, scale=sigma) - norm.cdf(number-0.5, loc=mu, scale=sigma)


def probability_of_port(port):
    return expon.cdf(port+0.49, scale=1 / exp_parameter) - expon.cdf(port-0.5, scale=1 / exp_parameter)


def array_of_ports_probability(port_array):
    probability = probability_of_number(len(port_array))
    for port in port_array:
        probability *= probability_of_port(port)
    return probability


if __name__ == '__main__':
    ports_open_number = sample_amount_ports_open()
    ports_open = sample_ports_open(ports_open_number)

    print(ports_open)
