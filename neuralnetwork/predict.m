function p = predict(Theta1, Theta2, X)
%PREDICT Predict the label of an input given a trained neural network
%   p = PREDICT(Theta1, Theta2, X) outputs the predicted label of X given the
%   trained weights of a neural network (Theta1, Theta2)

% Useful values
m = size(X, 1);
num_labels = size(Theta2, 1);

p = zeros(size(X, 1), 1);
X = [ones(m, 1) X];
Z_2 = X * Theta1'; % 5000 x 25
a_2 = sigmoid(Z_2);
a_2 = [ones(m,1) a_2];
Z_3 = a_2 * Theta2';
a_3 = sigmoid(Z_3);
[probablity,p] = max(a_3, [], 2); 








% =========================================================================


end
