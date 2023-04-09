class PIDController {
  constructor(
    proportional_constant = 0,
    integral_constant = 0,
    derivative_constant = 0
  ) {
    this.proportional_constant = proportional_constant;
    this.integral_constant = integral_constant;
    this.derivative_constant = derivative_constant;
    // Running sums
    this.integral_sum = 0;
    this.previous = 0;
  }

  handle_proportional(error) {
    return this.proportional_constant * error;
  }

  handle_integral(error) {
    this.integral_sum += error;
    return this.integral_constant * error;
  }

  handle_derivative(error) {
    const derivative = this.derivative_constant * (error - this.previous);
    this.previous = error;
    return derivative;
  }

  get_value(error) {
    let p = this.handle_proportional(error);
    let i = this.handle_integral(error);
    let d = this.handle_derivative(error);
    return p + i + d;
  }
}

module.exports = PIDController;
