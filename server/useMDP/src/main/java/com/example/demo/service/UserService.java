package com.example.demo.service;


import com.example.demo.exception.DuplicateUsernameException;
import com.example.demo.model.domain.Role;
import com.example.demo.model.domain.User;
import com.example.demo.model.dto.LoginDTO;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        // 사용자의 역할 정보도 함께 로드
        Set<GrantedAuthority> authorities = user.get().getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.get().getUsername(),
                user.get().getPassword(),
                authorities
        );
    }


    public UserDetails loadUserByUsernameAndPassword(String username, String password) throws UsernameNotFoundException {

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new BadCredentialsException("Bad credentials");
        }

        // 사용자의 역할 정보도 함께 로드
        Set<GrantedAuthority> authorities = user.get().getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.get().getUsername(),
                user.get().getPassword(),
                authorities
        );
    }

    public void registerUser(LoginDTO loginDTO) {
        // 비밀번호를 해싱하여 저장

        if(userRepository.findByUsername(loginDTO.getUsername()).isPresent()){
            throw new DuplicateUsernameException(loginDTO.getUsername());
        }


        User user = User.builder()
                .username(loginDTO.getUsername())
                .password(passwordEncoder.encode(loginDTO.getPassword()))
                .build();

        Role defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        user.getRoles().add(defaultRole);

        userRepository.save(user);
    }

}
