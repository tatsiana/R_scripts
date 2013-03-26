## Author: tatsiana

require(boot)
require(graphics)
require(fields)
require(ggplot2)
require(grid)
require(rgenoud)
## Frank-Wolfe alforithm
## Parameters: 
## fbs -  Initial Feasible Basic Solution: use LP to find one
## f - Objective function
## df1 - partial derivative WRT to x1
## df2 - partial derivative WRT to x2
## tol - tolerance level for stopping rule
## A - matrix of coefficients of constrains '<=' 
## b - vector of left hand side of the constrains '<='
## returns vector of x1,x2 - optimal solution
FW = function(fbs,f,df1,df2, tol,A,b){
  
   
  g = function(x1,x2,c){
    return(c[1]*x1+c[2]*x2)
  }
  h = function(t,x.init,x.soln){
    temp.x = x.init + t*(x.soln - x.init)
    return (f(temp.x[1],temp.x[2]))
  }
  solution.x = function(t.star, x.init,x.soln){
    return(x.init + t.star*(x.soln - x.init))
  }
  soln.matrix = c()
  c.matrix = c()
  k  = 1
  tol = 0.01
  x.init = fbs
  repeat{ 
    vector.c = c(df1(x.init[1]),df2(x.init[2]))
    x.soln = simplex(vector.c,A1=A,b1=b,maxi=T)[1]$soln
    t.star = optimize(h, c(0,1), tol = 0.0001, x.init=x.init, x.soln = x.soln, maximum=T)$maximum
    x.final.soln = solution.x(t.star,x.init,x.soln)
    #print(x.final.soln)
    eps = dist(rbind(x.init,x.final.soln))
    soln.matrix = rbind(soln.matrix,x.final.soln)
    c.matrix = rbind(c.matrix,vector.c)
    x.init = x.final.soln
    k = k+1
    if (eps < tol){
      break
    }
  }
  row.names(soln.matrix) = seq(1,nrow(soln.matrix))
  row.names(c.matrix) = seq(1,nrow(c.matrix))
  obj = list(soln = soln.matrix, c = c.matrix, solution = x.final.soln )
  return(obj)
}