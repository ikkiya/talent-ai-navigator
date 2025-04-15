
package com.yourcompany.talentmanagerapi.repository;

import com.yourcompany.talentmanagerapi.entity.User;
import com.yourcompany.talentmanagerapi.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByStatus(UserStatus status);
}
